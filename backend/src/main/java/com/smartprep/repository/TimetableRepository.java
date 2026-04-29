package com.smartprep.repository;

import com.smartprep.model.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TimetableRepository extends JpaRepository<TimetableSlot, UUID> {
    List<TimetableSlot> findByUserEmail(String email);
}
