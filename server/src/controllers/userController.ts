import { NextFunction, Request, Response } from "express";
import { CLIENTROLES } from "../constants/client";
import { ROLES } from "../constants/employee";
import { ERRORS } from "../constants/errors";
import Client from "../models/client.model";
import Employee, { isValid } from "../models/employee.model";
import Refund from "../models/refund.model";
import createToken from "../utils/createToken";
import { IEmplyee } from "../models/employee.model";
import { REFUNDSTATUS } from "../constants/refunds";
// @desc    Authenticate employee => send token back
// @route   Post /api/users/auth/employee
// @access  public
const authenticateEmployee = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const user = await Employee.findOne({ email: lowerCaseEmail });
  if (!user) throw new Error(ERRORS.invalid_cridentials);

  const isMatch = await user.validatePassword(password);
  if (!isMatch) throw new Error(ERRORS.invalid_cridentials);

  const token = createToken({
    email: user.email,
    name: user.name,
    role: user.role,
    id: user._id,
  });
  res.json({ token, role: user.role, activated: user.activated });
};

// @desc    Authenticate a client => send token back
// @route   Post /api/auth/login
// @access  public
const authenticateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await Client.findOne({ email });
  if (!user) throw new Error(ERRORS.invalid_cridentials);

  const isMatch = await user.validatePassword(password);
  if (!isMatch) throw new Error(ERRORS.invalid_cridentials);

  const token = createToken({
    email: user.email,
    name: user.name,
    role: CLIENTROLES.client,
    id: user._id,
  });
  res.json({ token, role: CLIENTROLES.client, activated: true });
};

// @desc    Create a support agent
// @route   Post /api/users/
// @access  private/ admin
const createSupportAgent = async (req: Request, res: Response) => {
  // Add validation to confirm the email belongs to the agent work email not another email
  // Add validation to check that all properties have values
  // Add validation to check password is strong
  const { email, name, password } = req.body;
  // const password = Math.random().toString(36).slice(-8);
  const existingUser = await Employee.findOne({ email });
  if (existingUser) throw new Error(ERRORS.user_already_exists);

  const lowerCaseEmail = email.toLowerCase();
  const user = await Employee.create({
    email: lowerCaseEmail,
    name,
    password,
    role: ROLES.support_agent,
    activated: false,
  });

  // Send an email to the agent with email and password
  // In first login the agent have to update the password

  res.json({
    message: "Support Agent created!",
    user,
  });
};

// @desc    Update a support agent
// @route   patch /api/users/:id
// @access  private/ admin
const updateSupportAgent = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await Employee.findById(req.params.id);
  if (!user) {
    throw new Error(ERRORS.not_found);
  }
  user.name = name;
  await user.save();
  res.json({ message: "Agent updated", user });
};

// @desc    Delete a support agent
// @route   delete /api/users/:id
// @access  private/ admin
const deleteSupportAgent = async (req: Request, res: Response) => {
  const agent = await Employee.findById(req.params.id);
  if (!agent) throw new Error(ERRORS.not_found);
  if (agent.processing) {
    await Refund.findOneAndUpdate(
      { agent: agent.processing },
      { agent: null, status: REFUNDSTATUS.pending }
    );
  }
  await Employee.deleteOne({ _id: req.params.id });

  res.json({ message: "support agent deleted" });
};

// @desc    Get all Support agents
// @route   get /api/users/
// @access  private/ admin
const getAllSupportAgents = async (req: Request, res: Response) => {
  const users = await Employee.find({ role: ROLES.support_agent }).select([
    "_id",
    "name",
    "email",
    "processing",
    "role",
    "activated",
  ]);
  res.send({ users });
};

// @desc    Get Support agent by Id
// @route   get /api/users/:id
// @access  private/ admin
const getSupportAgentsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!isValid(id)) throw new Error(ERRORS.bad_request);
  const user = await Employee.findOne({ _id: id });
  if (!user) throw new Error(ERRORS.not_found);
  res.json({ user });
};

const activateAccount = async (req: Request, res: Response) => {
  const agent = await Employee.findOne({
    _id: res.locals.user.id,
  });
  if (!agent) throw new Error(ERRORS.not_found);
  agent.password = req.body.password;
  agent.activated = true;
  agent.save();
  res.send({ user: agent });
};

// @desc    Get both employee and clients roles
// @route   get /api/users/roles
// @access  private/ admin
const getRoles = (req: Request, res: Response) => {
  res.send({ roles: { ...ROLES, ...CLIENTROLES } });
};

export {
  authenticateEmployee,
  authenticateClient,
  createSupportAgent,
  getAllSupportAgents,
  getSupportAgentsById,
  updateSupportAgent,
  deleteSupportAgent,
  getRoles,
  activateAccount,
};
