export default interface UserCaseInterface {
  validate();
  execute();
  executeAndHandleErrors();
}
