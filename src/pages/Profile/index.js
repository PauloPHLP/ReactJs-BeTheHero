import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import logo from "../../assets/logo.svg";
import "./styles.css";

export default function Profile() {
  const [incidents, setIncidets] = useState([]);
  const ngoId = localStorage.getItem("ngoId");
  const ngoName = localStorage.getItem("ngoName");
  const history = useHistory();

  useEffect(() => {
    api.get("ngo_profile", {
      headers: {
        Authorization: ngoId
      }
    }).then((response) => {
      setIncidets(response.data);
      console.log(response)
    });
  }, [ngoId]);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ngoId
        }
      });

      setIncidets(incidents.filter((incident) => incident.id !== id));
    } catch {
      alert("Erro ao deletar caso. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logo} alt="Be The Hero."/>
        <span>Seja bem-vinda, {ngoName}</span>
        <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
        <button type="button" onClick={() => handleLogout()}>
          <FiPower size={18} color="#E02041"/>
        </button>
      </header>
      <h1>Casos cadastrados</h1>
      <ul>
        {
          incidents.map((incident) => (
            <li key={incident.id}>
              <strong>Caso:</strong>
                <p>{incident.title}</p>
              <strong>Descrição</strong>
                <p>{incident.description}</p>
              <strong>Valor:</strong>
                <p>{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(incident.value)}</p>
              <button type="button" onClick={() => {handleDeleteIncident(incident.id)}}>
                <FiTrash2 size={20} color="#A8A8B3"/>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}