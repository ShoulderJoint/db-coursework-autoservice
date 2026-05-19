import React, { useState, useEffect } from 'react';

const VendorsTable = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/logistics/vendors')
            .then(res => res.json())
            .then(data => setVendors(data))
            .catch(err => console.error(err));
    }, []);
    return (
        <table className="data-table">
            <thead>
                <tr><th>Название</th><th>Регион</th><th>Город</th><th>Улица</th><th>Дом</th><th>Номер офиса/квартиры</th>
                <th>Почтовый индекс</th><th>ИНН</th><th>Телефон</th></tr>
            </thead>
            <tbody>
                {vendors.map(c => (
                    <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.region}</td>
                        <td>{c.city}</td>
                        <td>{c.street}</td>
                        <td>{c.house}</td>
                        <td>{c.flat || ''}</td>
                        <td>{c.postcode || ''}</td>
                        <td>{c.inn}</td>
                        <td>{c.phone || ''}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VendorsTable;