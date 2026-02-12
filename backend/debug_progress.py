from apps.users.models import User
from apps.members.models import Member
from apps.progress.models import ProgressLog

# Check progress logs
logs = ProgressLog.objects.all()
print(f"\n=== PROGRESS LOGS ===")
print(f"Total: {logs.count()}")
for log in logs:
    print(f"  Log {log.id}: member_id={log.member.id}, user={log.member.user.email}, date={log.date}, weight={log.weight}")

# Check miembro1 user
user = User.objects.get(email='miembro1@gimnasio.com')
print(f"\n=== USER miembro1@gimnasio.com ===")
print(f"User ID: {user.id}")
print(f"Role: {user.role.name}")
print(f"Has member_profile attr: {hasattr(user, 'member_profile')}")

# Check member objects
members = Member.objects.filter(user=user)
print(f"\n=== MEMBER OBJECTS ===")
print(f"Count: {members.count()}")
for member in members:
    print(f"  Member ID: {member.id}, User: {member.user.email}")

# Try to access member_profile
try:
    mp = user.member_profile
    print(f"\n=== MEMBER_PROFILE ===")
    print(f"Success! Member profile ID: {mp.id}")
except Exception as e:
    print(f"\n=== MEMBER_PROFILE ERROR ===")
    print(f"Error accessing member_profile: {e}")
