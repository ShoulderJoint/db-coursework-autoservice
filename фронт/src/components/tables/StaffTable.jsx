import React from 'react';
import { MOCK_STAFF, MOCK_SERVICE_STATIONS, MOCK_JOB_TITLES } from '../../data/mockData';

const StaffTable = () => {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Филиал</th><th>ФИО</th><th>Должность</th></tr>
      </thead>
      <tbody>
        {MOCK_STAFF.map(s => {
          const station = MOCK_SERVICE_STATIONS.find(st => st.id === s.service_station_id);
          const job = MOCK_JOB_TITLES.find(j => j.id === s.job_id);
          return (
            <tr key={s.id}>
              <td>{station ? station.city : s.service_station_id}</td>
              <td>{`${s.surname} ${s.name} ${s.patronymic || ''}`}</td>
              <td>{job ? job.name : 'Н/Д'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StaffTable;