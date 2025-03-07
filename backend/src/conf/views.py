from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.status import HTTP_200_OK


class HealthCheckView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        description="Ручка проверки работоспособности "
        "API (используется при деплое)"
    )
    def get(self, request):
        return Response({"status": "ok"}, status=HTTP_200_OK)
