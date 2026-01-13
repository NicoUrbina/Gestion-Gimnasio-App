import os
import importlib
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction

class Command(BaseCommand):
    help = 'Poblar la base de datos con datos iniciales (Seeders)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Iniciando proceso de Seeding...'))
        
        # Lista ordenada de seeders
        seeders = [
            '001_roles',
            '002_users',
            '003_plans',
            '004_class_types',
            '005_classes',
        ]
        
        for seeder_name in seeders:
            module_name = f"apps.common.seeds.{seeder_name}"
            self.stdout.write(f"\nEjecutando: {seeder_name}...")
            
            try:
                module = importlib.import_module(module_name)
                if hasattr(module, 'seed'):
                    with transaction.atomic():
                        result = module.seed()
                    self.stdout.write(self.style.SUCCESS(f"[OK] {seeder_name} completado"))
                else:
                    self.stdout.write(self.style.WARNING(f"[WARN] {seeder_name} no tiene funcion seed(), saltando."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"[ERROR] En {seeder_name}: {str(e)}"))
                import traceback
                traceback.print_exc()

        self.stdout.write(self.style.SUCCESS('\n¡Proceso de Seeding finalizado con exito!'))
