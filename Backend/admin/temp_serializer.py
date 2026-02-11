
class EmployeeSalaryDashboardSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        from employee.models import Employee
        model = Employee
        fields = ['id', 'name', 'username', 'department', 'designation', 'salary', 'status']

    def get_status(self, obj):
        # Access the related salary_status if it exists
        if hasattr(obj, 'salary_status'):
            return obj.salary_status.status
        return 'Pending'
