
import random
from django.db import migrations

def create_course_fees(apps, schema_editor):
    CourseFeeStructure = apps.get_model('custom_admin', 'CourseFeeStructure')
    
    courses = [
        "Advanced Java (005)", "AI in Cybersecurity (49)", "Application Developer Web and Mobile (FSD)", "AWS (012)",
        "AWS Internship (Internship-1)", "AWS Level 2 (AWS Advanced)", "CCNA (009)", "CCNP (23)",
        "CCNP-ENARSI (CCNP 23.1)", "CCNP-ENCOR (CCNP 23)", "Core Java (004)", "Core Java (PAP) (PAP-1)",
        "Cyber Security (10)", "Data Analytics Internship (Internship-2)", "Data Science & AI (28)",
        "Data Science & Business Analytics (001)", "Data Science & Machine Learning (019)", "Ethical Hacking (011)",
        "Front End Technologies (006)", "Full Stack Cloud & DevOps (FutureAcad-04)", 
        "Full Stack Cyber Security (FutureAcad-03)", "Full Stack Development – Python (26)",
        "Full Stack Software Developer Internship (Internship-3)", "Full Stack Software Developer with GenAI (FutureAcad-06)",
        "Hardware and Networking (37)", "Interview Prep Program (Interview-1)", "Java Frameworks (27)",
        "Machine Learning (002)", "Master in Data Analytics & Machine Learning (FutureAcad-02)",
        "Master in NextGen AI & Data Science (FutureAcad-01)", "MySQL / NoSQL (014)", "Networking & Cyber Security (22)",
        "Networking Essentials (Net-Ess)", "Professional in Cloud and DevOps (Professional-08)",
        "Professional in Core IT Ops: Network, Server & Cloud (Professional-01)",
        "Professional in Cyber Security Expert (Professional-06)", "Professional in Data Analytics (Professional-03)",
        "Professional in Generative AI and MLOps (Professional-05)",
        "Professional in Machine Learning & Deep Learning (Professional-04)", 
        "Professional in Web Development & DSA (Professional-02)", "Python Frameworks (008)", 
        "Python Programming (007)", "Server Admin & Cloud Computing (21)", "Soft Skills (43)", 
        "VMWare Essentials (13)", "Windows Server Administrator (24)"
    ]

    for course_name in courses:
        # Check to see if the course already exists to avoid duplication
        if not CourseFeeStructure.objects.filter(course_name=course_name).exists():
            # Generate random fee once
            fee = random.randint(5000, 15000)
            CourseFeeStructure.objects.create(course_name=course_name, fee_amount=fee)

class Migration(migrations.Migration):

    dependencies = [
        ('custom_admin', '0005_coursefeestructure'),
    ]

    operations = [
        migrations.RunPython(create_course_fees),
    ]
