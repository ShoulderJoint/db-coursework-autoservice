import React, { useState, useEffect } from 'react';

const ClientsTable = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/clients')
            .then(res => res.json())
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки базы клиентов:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Загрузка данных из БД...</p>;

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