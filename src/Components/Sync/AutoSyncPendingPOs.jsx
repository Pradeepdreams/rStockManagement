import { useEffect } from 'react';
import { getBranchDataFromBalaSilksDB, savePendingPOsData } from '../Utils/indexDB';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getDecryptedPosData } from '../Utils/indexDB';

const AutoSyncPendingPOs = () => {
  const syncPOs = async () => {
    const pendingPOs = await getDecryptedPosData('pendingPOs');
    if (!pendingPOs || pendingPOs.length === 0) return;

    const branchData = await getBranchDataFromBalaSilksDB('branchData');
    const branchIds = branchData?.map(branch => branch.branch.id_crypt) || [];
    const token = localStorage.getItem("token");

    if (!token || !branchIds.length) return;

    const successfullySynced = [];

    for (let po of pendingPOs) {
      try {
        await axios.post(
          'public/api/purchase-orders',
          po,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Branch-Id': branchIds[0],
            }
          }
        );
        successfullySynced.push(po);
      } catch (err) {
        console.error('Failed to sync PO:', err);
      }
    }

    if (successfullySynced.length > 0) {
      const remainingPOs = pendingPOs.filter(po => !successfullySynced.includes(po));
      await savePendingPOsData('pendingPOs', remainingPOs);
      toast.success("Pending Purchase Orders synced successfully!");
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online! Syncing pending POs...');
      syncPOs();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return null;
};

export default AutoSyncPendingPOs;
