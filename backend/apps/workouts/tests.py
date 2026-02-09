"""
Tests para API de Workouts
Sistema de Gestión de Gimnasio

Ejecutar con: python manage.py test apps.workouts
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.users.models import Role
from apps.members.models import Member
from apps.staff.models import Staff
from apps.workouts.models import MuscleGroup, Exercise, WorkoutRoutine, RoutineExercise

User = get_user_model()


class WorkoutAPITestCase(TestCase):
    """Test suite para endpoints de workouts"""
    
    def setUp(self):
        """Configuración inicial para cada test"""
        # Crear roles
        self.admin_role = Role.objects.create(name='Administrador')
        self.trainer_role = Role.objects.create(name='Entrenador')
        self.member_role = Role.objects.create(name='Miembro')
        
        # Crear usuarios
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            password='admin123',
            first_name='Admin',
            last_name='Test',
            role=self.admin_role
        )
        
        self.trainer_user = User.objects.create_user(
            email='trainer@test.com',
            password='trainer123',
            first_name='Trainer',
            last_name='Test',
            role=self.trainer_role
        )
        
        self.member_user = User.objects.create_user(
            email='member@test.com',
            password='member123',
            first_name='Member',
            last_name='Test',
            role=self.member_role
        )
        
        # Crear perfiles
        self.trainer = Staff.objects.create(
            user=self.trainer_user,
            position='Entrenador',
            hire_date='2024-01-01'
        )
        
        self.member = Member.objects.create(
            user=self.member_user,
            phone='1234567890',
            emergency_contact='Jane Doe',
            emergency_phone='0987654321'
        )
        
        # Crear datos de prueba
        self.muscle_group = MuscleGroup.objects.create(
            name='Pecho',
            description='Test muscle group'
        )
        
        self.exercise = Exercise.objects.create(
            name='Press de banca',
            description='Test exercise',
            muscle_group=self.muscle_group,
            difficulty='intermediate',
            equipment_needed='Barra'
        )
        
        # Cliente API
        self.client = APIClient()
    
    def test_login_required(self):
        """Test que endpoints requieren autenticación"""
        response = self.client.get('/api/workouts/exercises/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_exercises_as_member(self):
        """Test que miembros pueden listar ejercicios"""
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get('/api/workouts/exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_list_muscle_groups(self):
        """Test listar grupos musculares"""
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get('/api/workouts/muscle-groups/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_routine_as_trainer(self):
        """Test que trainers pueden crear rutinas"""
        self.client.force_authenticate(user=self.trainer_user)
        
        routine_data = {
            'member': self.member.id,
            'name': 'Test Routine',
            'description': 'Test description',
            'goal': 'Test goal',
            'duration_weeks': 4,
            'is_active': True,
            'exercises': [
                {
                    'exercise': self.exercise.id,
                    'day_of_week': 1,
                    'order': 1,
                    'sets': 3,
                    'reps': 12,
                    'rest_seconds': 60
                }
            ]
        }
        
        response = self.client.post(
            '/api/workouts/routines/',
            routine_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Routine')
        self.assertEqual(len(response.data['exercises']), 1)
    
    def test_member_cannot_create_routine(self):
        """Test que miembros NO pueden crear rutinas"""
        self.client.force_authenticate(user=self.member_user)
        
        routine_data = {
            'member': self.member.id,
            'name': 'Test Routine',
            'description': 'Test',
            'goal': 'Test',
            'duration_weeks': 4,
            'is_active': True,
            'exercises': []
        }
        
        response = self.client.post(
            '/api/workouts/routines/',
            routine_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_my_routine_as_member(self):
        """Test que miembros pueden ver su rutina activa"""
        # Crear rutina para el miembro
        routine = WorkoutRoutine.objects.create(
            member=self.member,
            trainer=self.trainer,
            name='My Active Routine',
            description='Test',
            goal='Test',
            duration_weeks=4,
            is_active=True
        )
        
        RoutineExercise.objects.create(
            routine=routine,
            exercise=self.exercise,
            day_of_week=1,
            order=1,
            sets=3,
            reps=12
        )
        
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get('/api/workouts/routines/my_routine/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'My Active Routine')
    
    def test_search_exercises(self):
        """Test búsqueda de ejercicios por nombre"""
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get('/api/workouts/exercises/?search=press')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_filter_exercises_by_muscle_group(self):
        """Test filtrar ejercicios por grupo muscular"""
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get(
            f'/api/workouts/exercises/?muscle_group={self.muscle_group.id}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for exercise in response.data['results']:
            self.assertEqual(exercise['muscle_group'], self.muscle_group.id)
    
    def test_only_one_active_routine_per_member(self):
        """Test validación de una sola rutina activa por miembro"""
        # Crear primera rutina activa
        WorkoutRoutine.objects.create(
            member=self.member,
            trainer=self.trainer,
            name='Routine 1',
            description='Test',
            goal='Test',
            duration_weeks=4,
            is_active=True
        )
        
        self.client.force_authenticate(user=self.trainer_user)
        
        # Intentar crear segunda rutina activa
        routine_data = {
            'member': self.member.id,
            'name': 'Routine 2',
            'description': 'Test',
            'goal': 'Test',
            'duration_weeks': 4,
            'is_active': True,
            'exercises': [
                {
                    'exercise': self.exercise.id,
                    'day_of_week': 1,
                    'order': 1,
                    'sets': 3,
                    'reps': 12,
                    'rest_seconds': 60
                }
            ]
        }
        
        response = self.client.post(
            '/api/workouts/routines/',
            routine_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('is_active', response.data)
