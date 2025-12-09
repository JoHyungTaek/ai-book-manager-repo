package com.aivle.backend.user.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 회원 정보 수정 요청 DTO
 * - 닉네임만 바꿀 수도 있고
 * - 비밀번호까지 같이 바꿀 수도 있게 설계
 */
@Getter
@Setter
public class UpdateUserRequest {

    // 변경할 닉네임 (선택)
    private String nickname;

    // 현재 비밀번호 (비밀번호 변경 시 필수)
    private String currentPassword;

    // 새 비밀번호 (선택)
    private String newPassword;
}
