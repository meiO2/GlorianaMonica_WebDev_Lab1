from rest_framework import serializers
from basic_api.models import DRFPost

class DRFPostSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = DRFPost
        fields = '__all__'

