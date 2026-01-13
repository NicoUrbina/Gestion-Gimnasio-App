import os
import importlib
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction

class Command(BaseCommand):
    help = 'Poblar la base de datos con datos iniciales (Seeders)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Iniciando proceso de Seeding...'))
        
        seeds_dir = os.path.join(settings.BASE_DIR, 'apps', 'common', 'seeds')
        
        # Obtener archivos .py ordenados
        seed_files = sorted([
            f for f in os.listdir(seeds_dir) 
            if f.endswith('.py') and f != '__init__.py'
        ])
        
        for seed_file in seed_files:
            module_name = f"apps.common.seeds.{seed_file[:-3]}"
            self.stdout.write(f"Ejecutando: {seed_file}...")
            
            try:
                module = importlib.import_module(module_name)
                if hasattr(module, 'run'):
                    with transaction.atomic():
                        module.run()
                    self.stdout.write(self.style.SUCCESS(f"[OK] {seed_file} completado"))
                else:
                    self.stdout.write(self.style.WARNING(f"[WARN] {seed_file} no tiene función run(), saltando."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"[ERROR] En {seed_file}: {str(e)}"))
                # Opcional: detener si falla uno
                # return

        self.stdout.write(self.style.SUCCESS('\n¡Proceso de Seeding finalizado con éxito!'))
