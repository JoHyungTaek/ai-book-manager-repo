package com.aivle.backend.board.repository;

import com.aivle.backend.board.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    @Modifying
    @Query(value = "update Board b set b.views = b.views + 1 where b.boardId = :boardId")
    void updateViews(Long boardId);
}
