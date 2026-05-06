import React from 'react';
import { MOCK_CLIENTS } from '../../data/mockData';

const ClientsTable = () => {
    return (
        <table className="data-table">
            <thead>
                <tr><th>Фамилия</th><th>Имя</th><th>Отчество</th><th>Телефон</th></tr>
            </thead>
            <tbody>
                {MOCK_CLIENTS.map(c => (
                    <tr key={c.id}>
                        <td>{c.surname}</td>
                        <td>{c.name}</td>
                        <td>{c.patronymic}</td>
                        <td>{c.phone}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ClientsTable;