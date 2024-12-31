package org.app.backend.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.app.backend.dto.ResponseLocation;
import org.app.backend.dto.VehiculeRequest;
import org.app.backend.dto.VehiculeRequestUp;
import org.app.backend.dto.VehiculeResp;
import org.app.backend.model.LocationData;
import org.app.backend.model.Vehicule;
import org.app.backend.service.LocationService;
import org.app.backend.service.VehiculeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/vehicule")
@RequiredArgsConstructor
public class VehiculeController {
    @GetMapping("/types")
    public ResponseEntity<List<String>> getalltype(){
        return ResponseEntity.ok(vehiculeService.getalltype());
    }
    @GetMapping("/get/{mat}")
    public ResponseEntity<VehiculeResp> findByMatricule(@PathVariable String mat) {
        Vehicule vehicule = vehiculeService.findByMatricule2(mat);
        if (vehicule == null) {
            // Handle the case when the vehicule is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        VehiculeResp response = new VehiculeResp(vehicule);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehiculeResp> findByMatricule(@PathVariable Long id) {
        Vehicule vehicule = vehiculeService.findByMatricule(id);
        if (vehicule == null) {
            // Handle the case when the vehicule is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        VehiculeResp response = new VehiculeResp(vehicule);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/matricule/{matricule}/modele/{modele}")
    public ResponseEntity<List<VehiculeResp>> findByMatriculeAndModele(@PathVariable String matricule, @PathVariable String modele) {
        List<Vehicule> vehicules = vehiculeService.findByMatriculeAndModele(matricule, modele);
        if (vehicules != null && !vehicules.isEmpty()) {
            List<VehiculeResp> vehiculesResp = new ArrayList<>();
            for (Vehicule vehicule : vehicules) {
                vehiculesResp.add(new VehiculeResp(vehicule));
            }
            return ResponseEntity.ok(vehiculesResp);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping
    public ResponseEntity<List<VehiculeResp>> findAll(
            @RequestParam(defaultValue = "")String search
    ) {
        List<Vehicule> vehicules = vehiculeService.findAll(search);

        List<VehiculeResp> vehiculesResp = new ArrayList<>();
        for (Vehicule vehicule : vehicules) {
            vehiculesResp.add(new VehiculeResp(vehicule));
        }
        for (VehiculeResp vehicule : vehiculesResp) {
            ResponseLocation lct=location.getLastLocationByVehicleId(vehicule.getId());
            if (lct != null) {
                List<Double> po=new ArrayList<>();
                po.add(lct.getLatitude());
                po.add(lct.getLongitude());
                vehicule.setLastpostion(po);
            }
        }
        return ResponseEntity.ok(vehiculesResp);
    }
    @GetMapping("/page")
    public ResponseEntity<Page<VehiculeResp>> findAllPag(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "")String search


    ){        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicule> vehicules = vehiculeService.findAllpage(search,pageable);

        return  ResponseEntity.ok(vehicules.map(VehiculeResp::new));
    }
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<VehiculeResp> editVehicule(@PathVariable long id, @Valid @ModelAttribute VehiculeRequestUp vehicule) {
        VehiculeResp response = new VehiculeResp(vehiculeService.editVehicule(id, vehicule));
        return ResponseEntity.ok(response);
    }
    @PostMapping
    public ResponseEntity<VehiculeResp> createVehicule(@Valid @ModelAttribute VehiculeRequest vehicule) {
        VehiculeResp response = new VehiculeResp(vehiculeService.createVehicule(vehicule));
        return ResponseEntity.ok(response);
    }
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<VehiculeResp> deleteVehicule(@PathVariable long id) {
        Vehicule vehicule = vehiculeService.deleteVehicule(id);
        if(vehicule!=null){
            return ResponseEntity.ok(new VehiculeResp(vehicule));
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    private final VehiculeService vehiculeService;
    private final LocationService location;

}
