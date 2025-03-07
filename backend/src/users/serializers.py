from django.contrib.auth.password_validation import (
    validate_password,
)
from django.core import exceptions
from rest_framework import serializers

from users.models import User, Bookmark


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True, required=False)
    refresh = serializers.CharField(read_only=True, required=False)

    class Meta:
        model = User
        fields = ["email", "password", "access", "refresh"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user

    def validate_password(self, value):
        try:
            validate_password(value)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(max_length=255)


class CurrentBookmarkSerializer(serializers.ModelSerializer):
    type = serializers.CharField(read_only=True, allow_null=True)
    worth_bookmark = serializers.BooleanField(read_only=True)

    class Meta:
        model = Bookmark
        fields = ["type", "worth_bookmark"]


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255)

    class Meta:
        fields = ["email", "password"]
