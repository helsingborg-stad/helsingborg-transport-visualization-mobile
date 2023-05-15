import { useEffect, useState } from 'react';
import { getAllZones } from '@src/api/zone';

export function useGetAllZones() {
  const [zones, setZones] = useState<any>(null);
  useEffect(() => {
    getAllZones()
      .then((res) => {
        setZones(res);
      })
      .catch((err) => {
        console.log('Zones Data error', err);
      });
  }, []);

  return {
    zones,
  };
}
