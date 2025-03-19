import React, { useState } from "react";

const AnimeFinder = () => {
  const URL = import.meta.env.VITE_ANIME_API;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOnChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /* const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResponse(null);
      setError("Search box is empty");
      return;
    }

    setSearchResponse(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${URL + searchQuery}`);
      const data = await response.json();

      if (!data?.data) {
        setError("Anime not found");
        setLoading(false);
        return;
      }

      console.log("Data.data: ", data.data);
      setSearchResponse(data.data);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setError("Failed to fetch anime data.");
    } finally {
      setSearchQuery("");
      setLoading(false);
    }
  }; */

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResponse(null);
      setError("Search box is empty");
      return;
    }

    setSearchResponse(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${URL + searchQuery}`);
      const data = await response.json();

      if (!data?.data || data.data.length === 0) {
        setError("Anime not found");
        setLoading(false);
        return;
      }

      // Fetch genres for each anime in parallel
      const updatedAnimeList = await Promise.all(
        data.data.map(async (anime) => {
          let genresList = [];

          if (anime?.relationships?.genres?.links?.related) {
            try {
              const genresResponse = await fetch(
                anime.relationships.genres.links.related
              );
              const genresData = await genresResponse.json();

              // Extract only the genre names
              genresList =
                genresData?.data?.map((genre) => genre.attributes.name) || [];
            } catch (err) {
              console.error(
                `Error fetching genres for ${anime.attributes?.canonicalTitle}:`,
                err
              );
            }
          }

          // Return the anime data with extracted genre names
          return { ...anime, genres: genresList };
        })
      );

      console.log("Updated: ", updatedAnimeList);
      setSearchResponse(updatedAnimeList);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setError("Failed to fetch anime data.");
    } finally {
      setSearchQuery("");
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-[10%] left-[50%] translate-x-[-50%] border border-neon-pink w-full max-w-[700px] backdrop-blur-md py-4 px-10 main-container">
      <h1 className="text-center text-4xl text-midnight-blue font-bold">
        AniRadar
      </h1>
      <p className="text-center my-4">Your Ultimate Anime Compass</p>

      {/* Search Box */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 border border-transparent md:border-neon-pink">
        <input
          type="text"
          name="searchAnime"
          id="searchAnime"
          value={searchQuery}
          onChange={handleOnChange}
          placeholder="Search Your Favourite Anime"
          className="w-full md:w-[80%] py-3 border border-neon-pink bg-transparent md:border-none outline-none px-4"
        />
        <button
          type="button"
          className="w-full md:w-[20%] py-3 transition-all duration-300 bg-neon-pink hover:text-neon-pink hover:bg-cyan-blue cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Output Result */}
      <div className="min-h-[250px]">
        {loading && (
          <div className="mt-6">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-cyan-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center">
              We are searching <br /> your anime
            </p>
          </div>
        )}

        {error !== null && (
          <p className="mt-6 text-center text-red-700">{error}</p>
        )}

        {searchResponse?.length > 0 &&
          searchResponse.map((item) => (
            <div key={item.id}>
              <div className="my-6 flex flex-col md:flex-row items-start gap-5">
                <img
                  src={item?.attributes?.posterImage?.large}
                  alt={searchQuery}
                  className="w-full md:w-[200px] aspect-[1/1] md:aspect-[3/4] object-cover anime-cover"
                />

                <div className="text-white w-full">
                  <h2 className="text-2xl font-bold text-cyan-blue">
                    {item.attributes.titles.en}
                  </h2>
                  <h3 className="text-cyan-blue text-lg">
                    {item.attributes.titles.ja_jp}
                  </h3>

                  <p className="mt-2">
                    <span className="font-semibold">Year:</span>{" "}
                    {item.attributes.startDate.split("-")[0]}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {item.attributes.status}
                  </p>

                  <p>
                    <span className="font-semibold">Episodes:</span>{" "}
                    {item.attributes.episodeCount || "N/A"}
                  </p>

                  <div className="mt-2 flex items-center gap-4">
                    <h3 className="font-semibold">Genres:</h3>
                    <ul className="flex flex-wrap gap-2 mt-1">
                      {item.genres?.map((genre, index) => (
                        <li
                          key={index}
                          className="bg-warm-orange text-white text-xs px-3 py-1 rounded-full"
                        >
                          {genre}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="mt-2">
                      <span className="font-semibold">Rating:</span>{" "}
                      {(item.attributes.averageRating / 20).toFixed(1) || "N/A"}{" "}
                      ⭐
                    </p>
                    <p>
                      <span className="font-semibold">Popularity:</span>{" "}
                      {item.attributes.popularityRank || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold">Synopsis:</h3>
                <p className="text-sm text-gray-300 line-clamp-4">
                  {item.attributes.synopsis}
                </p>
              </div>

              <hr className="mt-5 max-w-[80%] mx-auto border-dashed " />
            </div>
          ))}

        {/* {searchResponse !== null && (
          <>
            <div className="my-6 flex flex-col md:flex-row items-start gap-5">
              <img
                src={searchResponse?.images?.jpg?.large_image_url}
                alt={searchQuery}
                className="w-full md:w-[200px] aspect-[1/1] md:aspect-[3/4] object-cover anime-cover"
              />

              <div className="text-white w-full">
                
                <h2 className="text-2xl font-bold text-cyan-blue">
                  {searchResponse?.title_english}
                </h2>
                <h3 className="text-cyan-blue text-lg">
                  {searchResponse?.title_japanese}
                </h3>

                
                <p className="mt-2">
                  <span className="font-semibold">Year:</span>{" "}
                  {searchResponse?.year}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {searchResponse?.status}
                </p>
                <p>
                  <span className="font-semibold">Episodes:</span>{" "}
                  {searchResponse?.episodes || "N/A"}
                </p>

                
                <div className="mt-2 flex items-center gap-4">
                  <h3 className="font-semibold">Genres:</h3>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {searchResponse?.genres?.map((genre) => (
                      <li
                        key={genre.mal_id}
                        className="bg-warm-orange text-white text-xs px-3 py-1 rounded-full"
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>

                
                <div className="flex items-center justify-between">
                  <p className="mt-2">
                    <span className="font-semibold">Rating:</span>{" "}
                    {searchResponse?.score || "N/A"} ⭐
                  </p>
                  <p>
                    <span className="font-semibold">Popularity:</span>{" "}
                    {searchResponse?.popularity || "N/A"}
                  </p>
                </div>
              </div>
            </div>

           
            <div className="mt-3">
              <h3 className="font-semibold">Synopsis:</h3>
              <p className="text-sm text-gray-300 line-clamp-4">
                {searchResponse?.synopsis}
              </p>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default AnimeFinder;
