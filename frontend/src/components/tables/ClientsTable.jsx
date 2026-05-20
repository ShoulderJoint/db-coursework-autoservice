import React, { useState, useEffect } from 'react';

const ClientsTable = ({ clients, onEdit }) => {

    if (!clients || clients.length === 0) {
    return <p>Клиентов пока нет. Добавьте первого!</p>;
    }
    
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Телефон</th>
                </tr>
            </thead>
            <tbody>
                {clients.map(c => (
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.surname}</td>
                        <td>{c.name}</td>
                        <td>{c.patronymic || ''}</td>
                        <td>{c.phone}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ClientsTable;