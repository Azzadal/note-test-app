package com.javaspring.proj.repository;

import com.javaspring.proj.model.Note;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NotesRepository extends CrudRepository<Note, Integer> {
    Note findByHeading(String heading);

    @Modifying
    @Transactional
    @Query(value = "delete from notes where id=:id", nativeQuery = true)
    void deleteNote(@Param("id") Integer id);
}
