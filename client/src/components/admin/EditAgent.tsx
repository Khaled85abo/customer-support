import { useAdminContext } from "../../context/adminContext";
import { useEffect, useState } from "react";
import { AgentType, ResMsgVariantsType } from "../../types";
import ListComponent from "../List";
import { Button, Box, TextField, Typography, Alert } from "@mui/material";
import * as axios from "../../axios";
import { RESMSGVAIRANTS } from "../../constants/responseVariants";

const EditAgent = () => {
  const { adminState, getSupportAgents, updateAgent } = useAdminContext();
  const { agents } = adminState;
  const [agentToEdit, setAgentToEdit] = useState<AgentType | null>(null);
  const [name, setName] = useState("");

  const [resMsg, setResMsg] = useState<{
    type: ResMsgVariantsType;
    message: string;
  } | null>(null);

  const handleSetAgent = (agent: AgentType) => {
    setAgentToEdit(agent);
    setName(agent.name);
  };

  const handleUpdateAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agentToEdit) return;
    if (name.length == 0) {
      setResMsg({
        message: "User name Can't be empty",
        type: RESMSGVAIRANTS.error,
      });
      return;
    }
    if (name == agentToEdit.name) {
      setResMsg({
        message: "The name is exactly the same!",
        type: RESMSGVAIRANTS.error,
      });
      return;
    }
    if (!agentToEdit) return;
    updateAgent(agentToEdit._id, { name });
    setAgentToEdit(null);
  };

  useEffect(() => {
    const setTimeoutID = setTimeout(() => {
      setResMsg(null);
      console.log("remove error message");
    }, 5000);

    return () => clearTimeout(setTimeoutID);
  }, [agents, resMsg?.message]);

  return (
    <>
      {agentToEdit && (
        <>
          <Typography component="h1" variant="h5">
            Update support agent
          </Typography>
          <Box
            component="form"
            onSubmit={handleUpdateAgent}
            noValidate
            sx={{ mt: 1, padding: 3 }}>
            {resMsg && (
              <Alert sx={{ mb: 3, padding: 2 }} severity={resMsg.type}>
                {resMsg.message}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Update Support Agent
            </Button>
          </Box>
        </>
      )}
      {agents && (
        <ListComponent
          agents={adminState.agents}
          action={{ type: "edit", func: handleSetAgent }}
        />
      )}
    </>
  );
};

export default EditAgent;
