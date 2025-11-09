from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Grade


class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'full_name', 'major', 'role')
    list_filter = ('role', 'major')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('full_name', 'major', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'major', 'role', 'password1', 'password2'),
        }),
    )
    ordering = ('email',)


# ✅ Admin untuk model Grade
class GradeAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'student_name', 'instructor_name', 'score')
    list_filter = ('course_name', 'instructor__full_name')
    search_fields = ('student__full_name', 'student__email', 'course_name')

    # Biar tampil nama lengkap, bukan ID
    def student_name(self, obj):
        return obj.student.full_name
    student_name.short_description = 'Student'

    def instructor_name(self, obj):
        return obj.instructor.full_name if obj.instructor else '—'
    instructor_name.short_description = 'Instructor'

    # 🧭 Field yang bisa di-edit di form admin
    fields = ('student', 'instructor', 'course_name', 'score')
    autocomplete_fields = ['student', 'instructor']  # biar gampang nyari user


# ✅ Daftarkan keduanya ke admin site
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Grade, GradeAdmin)
