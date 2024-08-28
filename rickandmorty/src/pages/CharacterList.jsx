import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import randm from "../assets/logos/randm.png";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(42); // Total de páginas
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    // Leer el número de página y término de búsqueda de los parámetros de la URL
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    const termFromUrl = searchParams.get("name") || "";
    setCurrentPage(pageFromUrl);
    setSearchTerm(termFromUrl);

    const fetchCharacters = async (page, name = "") => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}${
            name ? `&name=${name}` : ""
          }`
        );
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages); // Actualizar el total de páginas basado en la respuesta
      } catch (error) {
        console.error("Error al cargar los personajes:", error);
      }
    };

    fetchCharacters(pageFromUrl, termFromUrl);
  }, [searchParams]);

  useEffect(() => {
    // Filtrar personajes por nombre
    if (searchTerm) {
      setFilteredCharacters(
        characters.filter((character) =>
          character.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCharacters(characters);
    }
  }, [characters, searchTerm]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setSearchParams({ page: nextPage, name: searchTerm });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      setSearchParams({ page: previousPage, name: searchTerm });
    }
  };

  const getPaginationButtons = () => {
    const paginationButtons = [];
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);

    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            setSearchParams({ page: i, name: searchTerm });
          }}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return paginationButtons;
  };

  return (
    <div>
      <img style={{ width: "250px" }} alt="" src={randm} />
      <h1>Personajes de Rick y Morty</h1>

      {/* Campo de filtro */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => {
            const term = e.target.value;
            setSearchTerm(term);
            setSearchParams({ page: 1, name: term }); // Reiniciar a la primera página al cambiar el filtro
          }}
        />
      </div>

      <div className="character-grid">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() =>
              navigate(`/character/${character.id}?page=${currentPage}`)
            }
          >
            <img src={character.image} alt={character.name} />
            <h4>{character.name}</h4>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Página Anterior
        </button>
        {getPaginationButtons()}
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Página Siguiente
        </button>
      </div>
    </div>
  );
};

export default CharacterList;
