import React, { useState, useEffect } from 'react';

const ServiceStationsTable = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/logistics/stations')
            .then(res => res.json())
            .then(data => setStations(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <table className="data-table">
            <thead>
                <tr><th>Регион</th><th>Город</th><th>Улица</th><th>Дом</th><th>Телефон</th></tr>
            </thead>
            <tbody>
                {stations.map(c => (
                    <tr key={c.id}>
                        <td>{c.region}</td>
                        <td>{c.city}</td>
                        <td>{c.street}</td>
                        <td>{c.house}</td>
                        <td>{c.phone_number}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ServiceStationsTable;