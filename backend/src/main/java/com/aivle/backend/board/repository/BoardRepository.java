package com.aivle.backend.board.repository;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.dto.BoardResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>, JpaSpecificationExecutor<Board> {
    @Query(value = "select b from Board b where b.type = :type")
    List<BoardResponseDto> findBoardByType(Board.Type type);

    @Modifying
    @Query(value = "update Board b set b.views = b.views + 1 where b.boardId = :boardId")
    void updateViews(Long boardId);
}
