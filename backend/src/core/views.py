from rest_framework.generics import ListAPIView


class SearchMixin:
    search_field = "name"

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get("search", None)
        if search_query:
            queryset = queryset.filter(
                **{f"{self.search_field}__icontains": search_query}
            )
        return queryset


class BaseSearchListView(SearchMixin, ListAPIView):
    pass
