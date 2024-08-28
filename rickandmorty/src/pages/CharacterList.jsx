import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import randm from "../assets/logos/randm.png";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(42); // Total de páginas
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Leer el número de página de los parámetros de la URL
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(pageFromUrl);

    const fetchCharacters = async (page) => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character?page=${page}`
        );
        setCharacters(response.data.results);
      } catch (error) {
        console.error("Error al cargar los personajes:", error);
      }
    };

    fetchCharacters(pageFromUrl);
  }, [searchParams]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setSearchParams({ page: nextPage });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      setSearchParams({ page: previousPage });
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
            setSearchParams({ page: i });
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
      <div className="character-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() =>
              navigate(`/character/${character.id}?page=${currentPage}`)
            } // Pasamos el número de página en la URL
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
