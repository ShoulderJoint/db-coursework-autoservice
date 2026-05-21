import React, { useState, useEffect } from 'react';

const VendorsTable = ({ vendors, onEdit, userRole }) => {

    const canEdit = userRole === 'advisor';

    if (!vendors) return <p>Загрузка данных из БД...</p>;
    if (vendors.length === 0) return <p>Поставщиков пока нет.</p>;

    return (
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                    <th>Название</th>
                    <th>ИНН</th>
                    <th>Регион</th>
                    <th>Город</th>
                    <th>Улица</th>
                    <th>Дом</th>
                    <th>Офис/Кв.</th>
                    <th>Индекс</th>
                    <th>Телефон</th>
                    {canEdit && <th>Действия</th>}

                </tr>
            </thead>
            <tbody>
                {vendors.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td>{v.name}</td>
                        <td>{v.inn}</td>
                        <td>{v.region}</td>
                        <td>{v.city}</td>
                        <td>{v.street}</td>
                        <td>{v.house}</td>
                        <td>{v.flat || ''}</td>
                        <td>{v.postcode || ''}</td>
                        <td>{v.phone || ''}</td>
                        {canEdit && (
                            <td>
                                <button
                                    className="btn-primary"
                                    style={{ padding: '6px 12px', cursor: 'pointer' }}
                                    onClick={() => onEdit(v)}
                                >
                                    Редактировать
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VendorsTable;