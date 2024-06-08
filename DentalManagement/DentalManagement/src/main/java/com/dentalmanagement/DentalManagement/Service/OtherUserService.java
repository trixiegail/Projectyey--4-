package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dentalmanagement.DentalManagement.Entity.OtherUserEntity;
import com.dentalmanagement.DentalManagement.Entity.OtherUserRole;
import com.dentalmanagement.DentalManagement.Repository.OtherUserRepository;

@Service
public class OtherUserService {

    @Autowired
    private OtherUserRepository otheruserrepo;

    public OtherUserEntity authenticateUser(String idNumber, String password) {
        return otheruserrepo.findByIdNumberAndPassword(idNumber, password);
    }

    public boolean hasAdminRole(OtherUserEntity user) {
        return user.getRole() == OtherUserRole.ADMIN;
    }

    public boolean hasNurseRole(OtherUserEntity user) {
        return user.getRole() == OtherUserRole.NURSE;
    }

    public boolean hasDoctorRole(OtherUserEntity user) {
        return user.getRole() == OtherUserRole.DOCTOR;
    }

    public boolean hasStaffRole(OtherUserEntity user) {
        return user.getRole() == OtherUserRole.STAFF;
    }

    // Insert the user
    public OtherUserEntity insertUser(OtherUserEntity user) {
        return otheruserrepo.save(user);
    }

    // Get all users
    public List<OtherUserEntity> getAllUsers() {
        return otheruserrepo.findAll();
    }

    // Get all nurses
    public List<OtherUserEntity> findNurseAccounts() {
        return otheruserrepo.findByRole(OtherUserRole.NURSE);
    }

    // Get all doctors
    public List<OtherUserEntity> findDoctorAccounts() {
        return otheruserrepo.findByRole(OtherUserRole.DOCTOR);
    }

    // Update user information
    public OtherUserEntity updateUser(int id, OtherUserEntity newUserDetails, OtherUserEntity currentUser) throws IllegalAccessException {
        OtherUserEntity user = otheruserrepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User " + id + " does not exist"));

        if (hasAdminRole(currentUser) || hasDoctorRole(currentUser) || hasStaffRole(currentUser) || hasNurseRole(currentUser)) {
            user.setIdNumber(newUserDetails.getIdNumber());
            user.setFirstname(newUserDetails.getFirstname());
            user.setLastname(newUserDetails.getLastname());
            user.setBirthdate(newUserDetails.getBirthdate());
            user.setEmail(newUserDetails.getEmail());
            user.setPassword(newUserDetails.getPassword());
        } else {
            throw new IllegalAccessException("You are not authorized to update this user's information.");
        }

        return otheruserrepo.save(user);
    }

    // Archive user account
    public OtherUserEntity archiveAccount(int id, OtherUserEntity currentUser) throws IllegalAccessException {
        OtherUserEntity userToArchive = otheruserrepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User " + id + " does not exist"));

        if (hasAdminRole(currentUser) || hasDoctorRole(currentUser)) {
            userToArchive.setArchived(true);
            return otheruserrepo.save(userToArchive);
        } else {
            throw new IllegalAccessException("You are not authorized to archive this user's account.");
        }
    }

    // Delete user account
    public boolean deleteUser(int id, OtherUserEntity currentUser) throws IllegalAccessException {
        if (hasAdminRole(currentUser) || hasDoctorRole(currentUser)) {
            try {
                otheruserrepo.deleteById(id);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            throw new IllegalAccessException("You are not authorized to delete this user's account.");
        }
    }
}
