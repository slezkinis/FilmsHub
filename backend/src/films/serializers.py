import re

from django.shortcuts import get_object_or_404
from rest_framework.serializers import ModelSerializer, ListSerializer
from rest_framework import serializers

from films.models import Film, Actor, Fact, Director


class ActorSerializer(ModelSerializer):
    class Meta:
        model = Actor
        fields = ["name", "english_name", "photo", "id"]


class ActorIdSerializer(ActorSerializer):
    class Meta(ActorSerializer.Meta):
        fields = "__all__"


class DirectorSerializer(ActorSerializer):
    class Meta(ActorSerializer.Meta):
        model = Director


class DirectorIdSerializer(DirectorSerializer):
    class Meta(DirectorSerializer.Meta):
        fields = "__all__"


class FactSerializer(ModelSerializer):
    class Meta:
        model = Fact
        fields = ["fact", "is_spoiler"]


class MovieSerializer(ModelSerializer):
    director = DirectorSerializer(read_only=True, required=False)
    facts = FactSerializer(
        many=True, required=False, help_text="Факты о фильме"
    )
    actors = ActorSerializer(many=True, read_only=True, required=False)
    actors_ids = ListSerializer(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    director_id = serializers.IntegerField(write_only=True, required=False)
    local = serializers.BooleanField(
        required=False,
        read_only=True,
        help_text="Отображает локальный ли этот фильм "
        "(создан пользователем), если пользователь"
        " не авторизован то False всегда",
    )

    class Meta:
        model = Film
        fields = [
            "year",
            "director_id",
            "actors_ids",
            "facts",
            "rating",
            "id",
            "name",
            "poster",
            "english_name",
            "alternative_name",
            "description",
            "director",
            "watch",
            "type",
            "genres",
            "countries",
            "actors",
            "trailer",
            "movie_length",
            "local",
        ]

        extra_kwargs = {
            "rating": {"required": True, "min_value": 0, "max_value": 10},
            "poster": {"required": False},
            "year": {"required": False, "min_value": 1800, "max_value": 2100},
            "watch": {"required": False},
        }

    def create(self, validated_data):
        actors_ids = validated_data.pop("actors_ids", [])
        director_id = validated_data.pop("director_id", None)
        facts = validated_data.pop("facts", [])

        instance = super().create(validated_data)
        for actor_id in actors_ids:
            actor = get_object_or_404(Actor, pk=actor_id)
            instance.actors.add(actor)

        if director_id:
            director = get_object_or_404(Director, pk=director_id)
            instance.director = director

        for fact_data in facts:
            fact_serializer = FactSerializer(data=fact_data)
            fact_serializer.is_valid(raise_exception=True)
            fact = Fact(film=instance, **fact_serializer.validated_data)
            fact.save()

        instance.user = self.context["request"].user
        instance.save()
        return instance

    def validate_english_name(self, value):
        pattern = r"^[A-Za-z\s\W\d_]+$"

        if not re.match(pattern, value):
            raise serializers.ValidationError()

        return value
