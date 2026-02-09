import os
import django
import re

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ERP.settings')
django.setup()

from student.models import Course
from admin.models import CourseFeeStructure

COURSES = [
  'Advanced Java (005)',
  'AI in Cybersecurity (49)',
  'Application Developer Web and Mobile (FSD)',
  'AWS (012)',
  'AWS Internship (Internship-1)',
  'AWS Level 2 (AWS Advanced)',
  'CCNA (009)',
  'CCNP (23)',
  'CCNP-ENARSI (CCNP 23.1)',
  'CCNP-ENCOR (CCNP 23)',
  'Core Java (004)',
  'Core Java (PAP) (PAP-1)',
  'Cyber Security (10)',
  'Data Analytics Internship (Internship-2)',
  'Data Science & AI (28)',
  'Data Science & Business Analytics (001)',
  'Data Science & Machine Learning (019)',
  'Ethical Hacking (011)',
  'Front End Technologies (006)',
  'Full Stack Cloud & DevOps (FutureAcad-04)',
  'Full Stack Cyber Security (FutureAcad-03)',
  'Full Stack Development – Python (26)',
  'Full Stack Software Developer Internship (Internship-3)',
  'Full Stack Software Developer with GenAI (FutureAcad-06)',
  'Hardware and Networking (37)',
  'Interview Prep Program (Interview-1)',
  'Java Frameworks (27)',
  'Machine Learning (002)',
  'Master in Data Analytics & Machine Learning (FutureAcad-02)',
  'Master in NextGen AI & Data Science (FutureAcad-01)',
  'MySQL / NoSQL (014)',
  'Networking & Cyber Security (22)',
  'Networking Essentials (Net-Ess)',
  'Professional in Cloud and DevOps (Professional-08)',
  'Professional in Core IT Ops: Network, Server & Cloud (Professional-01)',
  'Professional in Cyber Security Expert (Professional-06)',
  'Professional in Data Analytics (Professional-03)',
  'Professional in Generative AI and MLOps (Professional-05)',
  'Professional in Machine Learning & Deep Learning (Professional-04)',
  'Professional in Web Development & DSA (Professional-02)',
  'Python Frameworks (008)',
  'Python Programming (007)',
  'Server Admin & Cloud Computing (21)',
  'Soft Skills (43)',
  'VMWare Essentials (13)',
  'Windows Server Administrator (24)',
]

def seed_courses():
    print("Starting course seeding...")
    created_count = 0
    for course_str in COURSES:
        match = re.search(r'\(([^)]+)\)', course_str)
        if match:
            code = match.group(1)
            name = course_str.strip() # Use full name including code to match frontend logic
        else:
            # Handle cases without parenthesis if any, or skip
            continue

        # Create Course
        course, created = Course.objects.get_or_create(
            course_code=code,
            defaults={
                'course_name': name,
                'credits': 4,
                'department': 'IT',
                'semester': 1,
                'description': f'Course: {name}'
            }
        )
        if created:
            created_count += 1
            print(f"Created Course: {name} ({code})")
        
        # Ensure Fee Structure exists
        # We assume existing fees, but create if missing to prevent 0 fee issue
        fee, fee_created = CourseFeeStructure.objects.get_or_create(
            course_name=name,
            defaults={'fee_amount': 25000.00}
        )
        if fee_created:
            print(f"Created Fee Structure for: {name}")

    print(f"Seeding complete. Created {created_count} courses.")

if __name__ == '__main__':
    seed_courses()
