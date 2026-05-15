import React from 'react';
import { MOCK_VENDORS } from '../../data/mockData';

const VendorsTable = () => {
    return (
        <table className="data-table">
            <thead>
                <tr><th>Регион</th><th>Город</th><th>Улица</th><th>Дом</th><th>Номер офиса/квартиры</th><th>Почтовый индекс</th>
                    <th>ИНН</th><th>Телефон</th></tr>
            </thead>
            <tbody>
                {MOCK_VENDORS.map(c => (
                    <tr key={c.id}>
                        <td>{c.region}</td>
                        <td>{c.city}</td>
                        <td>{c.street}</td>
                        <td>{c.house}</td>
                        <td>{c.office_flat}</td>
                        <td>{c.postcode}</td>
                        <td>{c.TIN}</td>
                        <td>{c.phone_number}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VendorsTable;