from rest_framework import serializers


class SimiliarRequestSerializer(serializers.Serializer):
    film = serializers.CharField(max_length=255)


class WishRequestSerializer(serializers.Serializer):
    wish = serializers.CharField(max_length=255)
