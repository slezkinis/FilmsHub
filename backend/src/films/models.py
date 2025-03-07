from django.contrib.postgres.fields import ArrayField
from django.db import models


class Actor(models.Model):
    name = models.CharField("Имя", blank=True, null=True)
    photo = models.URLField("Фото", blank=True, null=True)
    english_name = models.CharField(
        "Английское название", blank=True, null=True
    )


class Director(models.Model):
    name = models.CharField("Имя", blank=True, null=True)
    photo = models.URLField("Фото", blank=True, null=True)
    english_name = models.CharField(
        "Английское название", blank=True, null=True
    )


class Film(models.Model):
    year = models.FloatField("Год релиза", null=True, blank=True)
    rating = models.FloatField("Рейтинг")
    poster = models.URLField("Постер", null=True, blank=True)
    name = models.CharField("Название", max_length=100)
    english_name = models.CharField(
        "Английское название", max_length=100, null=True, blank=True
    )
    alternative_name = models.CharField(
        "Альтернативное название", max_length=100, null=True, blank=True
    )
    description = models.TextField("Описание", null=True, blank=True)
    director = models.ForeignKey(
        Director,
        on_delete=models.CASCADE,
        related_name="director",
        null=True,
        blank=True,
        verbose_name="Режиссер",
    )
    type = models.CharField(
        max_length=50,
        choices=[
            ("movie", "Фильм"),
            ("tv-series", "Сериал"),
            ("cartoon", "Мультфильм"),
            ("anime", "Аниме"),
            ("animated-series", "Мульт сериал"),
            ("tv-show", "Телешоу"),
        ],
        verbose_name="Тип",
    )
    genres = ArrayField(models.CharField(max_length=50), verbose_name="Жанры")
    countries = ArrayField(
        models.CharField(max_length=50),
        null=True,
        blank=True,
        verbose_name="Страны",
    )
    actors = models.ManyToManyField(
        Actor, related_name="films", blank=True, verbose_name="Актеры"
    )
    trailer = models.URLField("Трейлер", null=True, blank=True)
    watch = models.URLField(
        "Ссылка на ресурс для просмотра", null=True, blank=True
    )
    movie_length = models.IntegerField(
        "Длина фильма в минутах", null=True, blank=True
    )
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        verbose_name="Пользователь",
    )

    @property
    def local(self):
        return True if self.user is not None else False


class Fact(models.Model):
    fact = models.TextField("Текст факта")
    is_spoiler = models.BooleanField("Это спойлер", default=False)
    film = models.ForeignKey(
        Film,
        on_delete=models.CASCADE,
        related_name="facts",
        verbose_name="Фильм",
    )
