import { useEffect, useState } from 'react';
import { getAllZones } from '@src/api/zone';
import { Zones } from '@src/modules/home/types';

export function useGetAllZones() {
  const [zones, setZones] = useState<Zones>(null);
  useEffect(() => {
    getAllZones()
      .then((res: Zones) => {
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
