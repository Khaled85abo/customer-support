import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import * as axios from "../axios";
import { RefundsStateType } from "../context/clientContext";
import ResolveRefund from "../components/agent/ResolveRefund";
import AssignRefund from "../components/agent/AssigenRefund";
const AgentDashboard = () => {
  const [refunds, setRefunds] = useState<RefundsStateType>({
    loading: false,
    error: "",
    refunds: [],
    refundOrders: {},
  });
  const [myRefunds, setMyRefunds] = useState({
    error: "",
    refunds: [],
    loading: false,
  });
  const getRefunds = async () => {
    setRefunds((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.getRefunds();
      setRefunds((prev) => ({ ...prev, refunds: res.data.refunds }));
    } catch (error: any) {
      setRefunds((prev) => ({ ...prev, error: error.response.body.error }));
    } finally {
      setRefunds((prev) => ({ ...prev, loading: false }));
    }
  };

  const getMyRefunds = async () => {
    setMyRefunds((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.getAgentRefund();
      setMyRefunds((prev) => ({ ...prev, refunds: res.data.refunds }));
    } catch (error: any) {
      setMyRefunds((prev) => ({ ...prev, error: error.response.body.error }));
    } finally {
      setMyRefunds((prev) => ({ ...prev, loading: false }));
    }
  };
  useEffect(() => {
    getRefunds();
    getMyRefunds();
  }, []);
  return (
    <Stack spacing={2}>
      {myRefunds.refunds.length > 0 && (
        <ResolveRefund refunds={myRefunds.refunds} />
      )}
      {refunds.refunds.length > 0 && (
        <AssignRefund
          refunds={refunds.refunds}
          hasRefund={myRefunds.refunds.length > 0}
        />
      )}
    </Stack>
  );
};

export default AgentDashboard;
