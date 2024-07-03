package com.dentalmanagement.DentalManagement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dentalmanagement.DentalManagement.DTO.AdminDTO;
import com.dentalmanagement.DentalManagement.Service.AdminService;

@RestController
@RequestMapping("/dentalmanagement")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/admin")
    public String adminLogin(@RequestBody AdminDTO loginRequest) {
        adminService.initializeAdmin();

        if (adminService.authenticateAdmin(loginRequest.getAdminUser(), loginRequest.getAdminPass())) {
            return "Admin login successful";
        } else {
            throw new RuntimeException("Admin login failed");
        }
    }

}
