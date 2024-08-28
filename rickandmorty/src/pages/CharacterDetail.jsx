import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const CharacterDetail = () => {
  const { id } = useParams(); // Obtener el ID del personaje desde la URL
  const [character, setCharacter] = useState(null);
  const [searchParams] = useSearchParams(); // Para obtener el parámetro de la página
  const navigate = useNavigate();
  const currentPage = searchParams.get("page"); // Obtener el valor del parámetro 'page'

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error("Error al cargar el personaje:", error);
      }
    };

    fetchCharacterDetail();
  }, [id]);

  if (!character) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="character-detail">
      <h1>{character.name}</h1>
      <img src={character.image} alt={character.name} />
      <p>
        <strong>Estado:</strong> {character.status}
      </p>
      <p>
        <strong>Especie:</strong> {character.species}
      </p>
      <p>
        <strong>Tipo:</strong> {character.type || "N/A"}
      </p>
      <p>
        <strong>Género:</strong> {character.gender}
      </p>
      <p>
        <strong>Origen:</strong> {character.origin.name}
      </p>
      <p>
        <strong>Ubicación:</strong> {character.location.name}
      </p>

      <button
        onClick={() => navigate(`/?page=${currentPage}`)}
        className="back-button"
      >
        Volver
      </button>
    </div>
  );
};

export default CharacterDetail;
