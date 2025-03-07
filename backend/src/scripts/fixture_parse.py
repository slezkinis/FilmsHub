import json
import os

directory = "filtered/filtered"

fixture = []

actor_id = 1
director_id = 1
film_id = 1
fact_id = 1

actors_seen = {}
directors_seen = {}

processed_files = 0

files = [
    f
    for f in os.listdir(directory)
    if f.startswith("movies_") and f.endswith(".json")
]
total_files = len(files)

for filename in files:
    if film_id > 1500:
        break
    processed_files += 1
    print(f"Обработка файла {processed_files} из {total_files}: {filename}")

    with open(
        os.path.join(directory, filename), "r", encoding="utf-8"
    ) as file:
        data = json.load(file)

    for movie in data:
        watch = movie.get("watchability", {})
        trailer = movie.get("trailer", {})
        film_data = {
            "model": "films.Film",
            "pk": film_id,
            "fields": {
                "year": movie.get("year", None),
                "rating": movie.get("rating", {}).get("kp", None),
                "poster": movie.get("poster", {}).get("url", None),
                "name": movie.get("name", ""),
                "english_name": movie.get("enName", None),
                "alternative_name": movie.get("alternativeName", None),
                "description": movie.get("description", ""),
                "type": movie.get("type", ""),
                "genres": [genre["name"] for genre in movie.get("genres", [])],
                "countries": [
                    country["name"] for country in movie.get("countries", [])
                ],
                "trailer": (
                    movie.get("videos", {})
                    .get("trailers", [{}])[0]
                    .get("url", None)
                    if len(trailer.get("videos", [])) > 0
                    else None
                ),
                "watch": (
                    watch.get("items", [{"n"}])[0].get("url", None)
                    if len(watch.get("items", -1)) > 0
                    else None
                ),
                "movie_length": movie.get("movieLength", None),
                "actors": [],
                "director": None,
            },
        }
        fixture.append(film_data)

        for person in movie.get("persons", []):
            if person.get("enProfession") == "director":
                director_name = person["name"]
                if director_name not in directors_seen:
                    director_data = {
                        "model": "films.Director",
                        "pk": director_id,
                        "fields": {
                            "name": director_name,
                            "photo": person["photo"],
                            "english_name": person.get("enName", ""),
                        },
                    }
                    fixture.append(director_data)
                    directors_seen[director_name] = director_id
                    director_id += 1

                film_data["fields"]["director"] = directors_seen[director_name]

        for actor in movie.get("persons", [])[:5]:
            if actor.get("enProfession") == "actor":
                actor_name = actor["name"]
                if actor_name not in actors_seen:
                    actor_data = {
                        "model": "films.Actor",
                        "pk": actor_id,
                        "fields": {
                            "name": actor_name,
                            "photo": actor["photo"],
                            "english_name": actor.get("enName", ""),
                        },
                    }
                    fixture.append(actor_data)
                    actors_seen[actor_name] = actor_id
                    actor_id += 1

                film_data["fields"]["actors"].append(actors_seen[actor_name])

        if movie.get("facts") is not None and len(movie.get("facts", [])) > 0:
            for fact in movie.get("facts", [])[:3]:
                fact_data = {
                    "model": "films.Fact",
                    "pk": fact_id,
                    "fields": {
                        "fact": fact["value"],
                        "is_spoiler": fact.get("spoiler", False),
                        "film": film_id,
                    },
                }
                fixture.append(fact_data)
                fact_id += 1

        film_id += 1

with open("../fixtures/fixture.json", "w", encoding="utf-8") as f:
    json.dump(fixture, f, ensure_ascii=False, indent=4)

print(
    f"Фикстура успешно создана"
    f" и сохранена в файл 'fixture.json'."
    f" Обработано файлов: {processed_files} из {total_files}."
)
