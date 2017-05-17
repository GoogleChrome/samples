package com.google.account.internal.storage;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;

import com.google.account.internal.UserImpl;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.util.EmailValidator;

/**
 * Manages the create/read/update/delete of the UserImpl objects. Notes the UserImpl (instead of
 * UserRecord) is used in the methods.
 * 
 * @author guibinkong@google.com (Guibin Kong)
 */
public class UserStore {

  /**
   * Enumerates error code for upgrade operation.
   */
  public static enum AccountOperationResponseCode {
    OK, USER_NOT_FOUND;
  }

  public static enum SignupError {
    INVALID_EMAIL, EMAIL_REGISTERED, EMPTY_DISPLAY_NAME, INVALID_PASSWORD, CONFIRM_MISMATCH
  }

  private static final Logger log = Logger.getLogger(UserStore.class.getName());
  private static final PersistenceManagerFactory pmf = JDOHelper
      .getPersistenceManagerFactory("transactions-optional");

  private static UserRecord findUserById(PersistenceManager pm, long userId) {
    String query = "select from " + UserRecord.class.getName() + " where id == " + userId;
    @SuppressWarnings("unchecked")
    // No easy way to work-around the casting
    List<UserRecord> users = (List<UserRecord>) pm.newQuery(query).execute();
    if (!users.isEmpty()) {
      return users.get(0);
    }
    return null;
  }

  private static UserRecord findUserByEmail(PersistenceManager pm, String email) {
    String query =
        "select from " + UserRecord.class.getName() + " where email == '" + email + "'";
    @SuppressWarnings("unchecked")
    // No easy way to work-around the casting
    List<UserRecord> users = (List<UserRecord>) pm.newQuery(query).execute();
    if (!users.isEmpty()) {
      return users.get(0);
    }
    return null;
  }

  /**
   * Checks if an email is registered in this site.
   * 
   * @param email the email address to be checked
   * @return whether the email is registered
   */
  public static boolean isEmailRegistered(String email) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserByEmail(pm, email);
      return user != null;
    } finally {
      pm.close();
    }
  }

  /**
   * Returns the user for an email, or null if not found.
   * 
   * @param email the email address to be checked
   * @return the user object, or null if not exist.
   */
  public static UserImpl getUserByEmail(String email) {
    UserImpl user = null;
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord record = findUserByEmail(pm, email);
      if (record != null) {
        user = createUserByRecord(record);
      }
    } finally {
      pm.close();
    }
    return user;
  }

  /**
   * Returns the user for an email, or null if not found.
   * 
   * @param userId the id of the user to be checked
   * @return the user object, or null if not exist.
   */
  public static UserImpl getUserById(long userId) {
    UserImpl user = null;
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord record = findUserById(pm, userId);
      if (record != null) {
        user = createUserByRecord(record);
      }
    } finally {
      pm.close();
    }
    return user;
  }

  /**
   * Returns whether the password is same.
   * 
   * @param email the email user inputs
   * @param password the password user inputs
   */
  public static boolean login(String email, String password) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserByEmail(pm, email);
      return user != null && !Strings.isNullOrEmpty(password)
          && password.equals(user.getPassword());
    } finally {
      pm.close();
    }
  }

  /**
   * Deletes the user for the email.
   * 
   * @param email the email address to be deleted
   * @return response code for the operation
   */
  public static AccountOperationResponseCode delete(String email) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserByEmail(pm, email);
      if (user != null) {
        pm.deletePersistent(user);
        return AccountOperationResponseCode.OK;
      } else {
        return AccountOperationResponseCode.USER_NOT_FOUND;
      }
    } finally {
      pm.close();
    }
  }

  /**
   * Changes the password for an email.
   * 
   * @param email the email address to be updated
   * @param oldPassword the old password
   * @param newPassword the new password
   * @return response code for the operation
   */
  public static AccountOperationResponseCode updatePassword(String email, String oldPassword,
      String newPassword) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserByEmail(pm, email);
      if (user != null) {
        user.setPassword(newPassword);
        pm.makePersistent(user);
        return AccountOperationResponseCode.OK;
      } else {
        return AccountOperationResponseCode.USER_NOT_FOUND;
      }
    } finally {
      pm.close();
    }
  }

  public static AccountOperationResponseCode setBigAccountChangeTime(long userId) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserById(pm, userId);
      if (user != null) {
        user.setLastBigChangeTime(System.currentTimeMillis());
        pm.makePersistent(user);
        return AccountOperationResponseCode.OK;
      } else {
        return AccountOperationResponseCode.USER_NOT_FOUND;
      }
    } finally {
      pm.close();
    }
  }

  /**
   * Changes the password for an email.
   * 
   * @param email the email address to be updated
   * @param oldPassword the old password
   * @param newPassword the new password
   * @return response code for the operation
   */
  public static AccountOperationResponseCode updateProfile(String email, String displayName,
      String photoUrl) {
    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord user = findUserByEmail(pm, email);
      if (user != null) {
        user.setDisplayName(displayName);
        user.setPhotoUrl(photoUrl);
        pm.makePersistent(user);
        return AccountOperationResponseCode.OK;
      } else {
        return AccountOperationResponseCode.USER_NOT_FOUND;
      }
    } finally {
      pm.close();
    }
  }

  /**
   * Creates an new user by the input fields.
   * 
   * @param parameters user's input fields
   * @param errors an array to output multiple error messages
   * @return the created user
   */
  public static UserImpl signup(Map<String, String[]> parameters, String ip,
      List<SignupError> errors) {
    log.entering("GaeStore", "signup");
    String email = getFirst(parameters, "email");
    String displayName = getFirst(parameters, "displayName");
    String photoUrl = getFirst(parameters, "photoUrl");
    String password = getFirst(parameters, "password");
    String confirm = getFirst(parameters, "confirm");
    if (Strings.isNullOrEmpty(email) || !EmailValidator.isValid(email)) {
      errors.add(SignupError.INVALID_EMAIL);
    }
    if (Strings.isNullOrEmpty(displayName)) {
      errors.add(SignupError.EMPTY_DISPLAY_NAME);
    }
    if (Strings.isNullOrEmpty(password)) {
      errors.add(SignupError.INVALID_PASSWORD);
    } else if (!password.equals(confirm)) {
      errors.add(SignupError.CONFIRM_MISMATCH);
    } else if (password.length() < 3) {
      errors.add(SignupError.INVALID_PASSWORD);
    }

    PersistenceManager pm = pmf.getPersistenceManager();
    try {
      UserRecord record = findUserByEmail(pm, email);
      if (record != null) {
        errors.add(SignupError.EMAIL_REGISTERED);
      } else if (errors.isEmpty()) {
        log.fine("Create new legacy user for: " + email);
        record = new UserRecord();
        record.setEmail(email);
        record.setDisplayName(displayName);
        record.setPhotoUrl(photoUrl);
        record.setPassword(password);
        record.setTosAccepted(true);
        record.setLastBigChangeTime(System.currentTimeMillis());
        pm.makePersistent(record);
        UserImpl user = createUserByRecord(record);
        return user;
      }
    } finally {
      pm.close();
    }
    log.exiting("GaeStore", "signup");
    return null;
  }

  private static UserImpl createUserByRecord(UserRecord record) {
    UserImpl user = new UserImpl();
    user.setUid(record.getId());
    user.setEmail(record.getEmail());
    user.setDisplayName(record.getDisplayName());
    user.setPhotoUrl(record.getPhotoUrl());
    // Password not copied.
    user.setTosAccepted(record.isTosAccepted());
    user.setLastBigChangeTime(record.getLastBigChangeTime());
    return user;
  }

  private static String getFirst(Map<String, String[]> parameters, String parameterName) {
    Preconditions.checkArgument(parameters != null);
    Preconditions.checkArgument(!Strings.isNullOrEmpty(parameterName));
    String ret = null;
    String[] value = parameters.get(parameterName);
    if (value != null && value.length >= 1) {
      ret = value[0];
    }
    return ret;
  }
}
