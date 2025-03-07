from django.db import models
from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )
        user.set_password(password)
        user.save()
        return user


class User(AbstractUser):
    email = models.EmailField("Почта", unique=True)
    password = models.CharField("Пароль", max_length=200)
    username = None
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    @property
    def likes(self):
        return Bookmark.objects.filter(type="like", user=self)

    @property
    def dislikes(self):
        return Bookmark.objects.filter(type="dislike", user=self)

    @property
    def aside(self):
        return Bookmark.objects.filter(type="aside", user=self)

    @property
    def viewed(self):
        return Bookmark.objects.filter(type="viewed", user=self)


class Bookmark(models.Model):
    film = models.ForeignKey(
        "films.Film", on_delete=models.CASCADE, verbose_name="Фильм"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Пользователь"
    )
    type = models.CharField(
        max_length=100,
        choices=(
            ("like", "like"),
            ("dislike", "dislike"),
            ("aside", "aside"),
            ("viewed", "viewed"),
        ),
        verbose_name="Тип",
    )
