import React from 'react';
import { MOCK_SERVICE_STATIONS } from '../../data/mockData';

const SetviceStationsTable = () => {
    return (
        <table className="data-table">
            <thead>
                <tr><th>Регион</th><th>Город</th><th>Улица</th><th>дом</th><th>Телефон</th></tr>
            </thead>
            <tbody>
                {MOCK_SERVICE_STATIONS.map(c => (
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

export default SetviceStationsTable;