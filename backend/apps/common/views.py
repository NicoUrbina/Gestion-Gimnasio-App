"""
Vistas públicas comunes (ej: tasa de cambio BCV)
"""
import re
import logging
from decimal import Decimal

import requests
from bs4 import BeautifulSoup
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

BCV_URL = "https://www.bcv.org.ve/"
CACHE_KEY = "bcv_usd_rate"
CACHE_TIMEOUT = 60 * 60  # 1 hora - BCV actualiza la tasa una vez al día


def _parse_bcv_rate(text: str) -> Decimal | None:
    """Parsea el valor de tasa (formato venezolano: 339,14950000) a Decimal."""
    if not text:
        return None
    # Reemplazar coma decimal por punto
    cleaned = re.sub(r'[^\d,.]', '', text).replace('.', '').replace(',', '.')
    try:
        return Decimal(cleaned)
    except Exception:
        return None


def fetch_bcv_usd_rate() -> tuple[Decimal | None, str | None]:
    """
    Obtiene la tasa USD del BCV desde bcv.org.ve.
    Retorna (rate, date_string) o (None, None) si falla.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        }
        resp = requests.get(BCV_URL, headers=headers, timeout=10)
        resp.raise_for_status()
        html = resp.text

        # Estrategia 1: Imagen dollar en BCV, el rate suele estar en un strong/div cercano
        # Buscar "dollar" en src de img y luego el siguiente bloque con número
        dollar_img = re.search(r'dollar[^"]*\.png', html, re.I)
        if dollar_img:
            start = dollar_img.end()
            # Buscar el primer número con formato venezolano (ej: 339,14950000) después
            snippet = html[start : start + 500]
            rate_match = re.search(r'>\s*([\d.,]+)\s*<', snippet)
            if rate_match:
                rate = _parse_bcv_rate(rate_match.group(1))
                if rate and 200 < float(rate) < 600:
                    return rate, None

        # Estrategia 2: Buscar "USD" y el número que sigue en el HTML
        usd_match = re.search(
            r'USD\s*</?\w*[^>]*>\s*([\d.,]+)', html, re.IGNORECASE | re.DOTALL
        )
        if usd_match:
            rate = _parse_bcv_rate(usd_match.group(1))
            if rate and rate > 0:
                return rate, None

        # Estrategia 3: BeautifulSoup - divs que contengan USD
        soup = BeautifulSoup(html, "html.parser")
        for elem in soup.find_all(string=re.compile(r"USD", re.I)):
            parent = elem.parent
            if parent:
                text = parent.get_text() if hasattr(parent, "get_text") else str(parent)
                if "USD" in text.upper():
                    match = re.search(r"([\d.,]+)", text)
                    if match:
                        rate = _parse_bcv_rate(match.group(1))
                        if rate and 200 < float(rate) < 600:
                            return rate, None

        # Estrategia 4: Cualquier número con formato 3xx,xx (rango tasa BCV típica)
        all_rates = re.findall(r"\b(\d{3},\d{2,})\b", html)
        for r in all_rates:
            parsed = _parse_bcv_rate(r)
            if parsed and 200 < float(parsed) < 600:
                return parsed, None

    except requests.RequestException as e:
        logger.warning("Error fetching BCV: %s", e)
    except Exception as e:
        logger.exception("Error parsing BCV: %s", e)
    return None, None


@api_view(["GET"])
@permission_classes([AllowAny])
def bcv_exchange_rate(request):
    """
    GET /api/exchange-rate/bcv/
    Retorna la tasa USD del BCV (Bs por 1 USD).
    Público, cacheado 1 hora.
    """
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        return Response(cached)

    rate, date_str = fetch_bcv_usd_rate()
    if rate is None:
        return Response(
            {"error": "No se pudo obtener la tasa del BCV"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    data = {
        "usd_rate": str(rate),
        "date": date_str,
    }
    cache.set(CACHE_KEY, data, CACHE_TIMEOUT)
    return Response(data)
