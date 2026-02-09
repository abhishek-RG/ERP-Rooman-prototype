import os
import django
import re
import sys
from django.utils.text import slugify

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ERP.settings')
django.setup()

from admin.models import CourseFeeStructure
from student.models import Course

raw_data = """
Advanced Java (005)
AI in Cybersecurity (49)
Application Developer Web and Mobile (FSD)
AWS (012)
AWS Internship (Internship-1)
AWS Level 2 (AWS Advanced)
CCNA (009)
CCNP (23)
CCNP-ENARSI (CCNP 23.1)
CCNP-ENCOR (CCNP 23)
Core Java (004)
Core Java (PAP) (PAP-1)
Cyber Security (10)
Data Analytics Internship (Internship-2)
Data Science & AI (28)
Data Science & Business Analytics (001)
Data Science & Machine Learning (019)
Ethical Hacking (011)
Front End Technologies (006)
Full Stack Cloud & DevOps (FutureAcad-04)
Full Stack Cyber Security (FutureAcad-03)
Full Stack Development – Python (26)
Full Stack Software Developer Internship (Internship-3)
Full Stack Software Developer with GenAI (FutureAcad-06)
Hardware and Networking (37)
Interview Prep Program (Interview-1)
Java Frameworks (27)
Machine Learning (002)
Master in Data Analytics & Machine Learning (FutureAcad-02)
Master in NextGen AI & Data Science (FutureAcad-01)
MySQL / NoSQL (014)
Networking & Cyber Security (22)
Networking Essentials (Net-Ess)
Professional in Cloud and DevOps (Professional-08)
Professional in Core IT Ops: Network, Server & Cloud (Professional-01)
Professional in Cyber Security Expert (Professional-06)
Professional in Data Analytics (Professional-03)
Professional in Generative AI and MLOps (Professional-05)
Professional in Machine Learning & Deep Learning (Professional-04)
Professional in Web Development & DSA (Professional-02)
Python Frameworks (008)
Python Programming (007)
Server Admin & Cloud Computing (21)
Soft Skills (43)
VMWare Essentials (13)
Windows Server Administrator (24)
"""

lines = [l.strip() for l in raw_data.strip().split('\n') if l.strip()]

print(f"Processing {len(lines)} courses...")

for l in lines:
    name = l.strip()
    code = None
    match = re.match(r'(.*)\s*\((.*)\)$', name)
    
    if match:
        name_part = match.group(1).strip()
        code_part = match.group(2).strip()
        name = name_part
        code = code_part
    else:
        # Generate code from name if missing
        code = slugify(name)[:20].upper()
    
    defaults = {
        'course_code': code, 
        'credits': 4, 
        'department': 'CS', 
        'semester': 1,
        'description': name
    }

    try:
        # Check if course exists by name
        course_obj = Course.objects.filter(course_name=name).first()
        if course_obj:
            # Update if code changed (unless duplicate code exists)
            if course_obj.course_code != code:
                # Check for conflict
                if not Course.objects.filter(course_code=code).exists():
                    course_obj.course_code = code
                    course_obj.save()
                    print(f"Updated code for {name}")
        else:
            # Create new
             # Handle unique code constraint
            base_code = code
            counter = 1
            while Course.objects.filter(course_code=code).exists():
                code = f"{base_code}-{counter}"
                counter += 1
            
            Course.objects.create(
                course_name=name,
                course_code=code,
                credits=4,
                department='CS',
                semester=1,
                description=name
            )
            print(f"Created course {name}")

        # Fee Structure
        fee = 25000.00
        fs, created = CourseFeeStructure.objects.get_or_create(
            course_name=name,
            defaults={'fee_amount': fee}
        )
        if created:
             print(f"Added Fee Structure for {name}")

    except Exception as e:
        print(f"Error processing {name}: {e}")

print("Seeding completed.")
