package com.aivle.backend.board.repository;

import com.aivle.backend.board.domain.Board;
import com.aivle.backend.board.domain.Reply;
import com.aivle.backend.board.dto.ReplyResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Page<Reply> findRepliesByBoard_BoardId(Long boardId, Pageable pageable);
}
