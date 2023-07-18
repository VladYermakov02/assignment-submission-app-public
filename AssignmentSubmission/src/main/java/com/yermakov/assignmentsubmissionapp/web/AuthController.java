package com.yermakov.assignmentsubmissionapp.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yermakov.assignmentsubmissionapp.dto.AuthCredentialsRequest;
import com.yermakov.assignmentsubmissionapp.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;

import com.yermakov.assignmentsubmissionapp.domain.User;

//Controllers listen to the end-points
//so to speak listen to all the posts, reads, deletes, updates and so on
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;

	// @RequestBody for binding this thing with body in postman
	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest request) {
		try {
			Authentication authenticate = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

			User user = (User) authenticate.getPrincipal();
			user.setPassword(null);
			return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(user)).body(user);
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
	
	// ResponseEntity returns response
	// localhost:8081/api/auth/validate?token=token_name
	// @RequestParam == ?token=token_name
	@GetMapping("/validate")
	public ResponseEntity<?> validateToken(@RequestParam String token, @AuthenticationPrincipal User user) {
		try {			
			Boolean isTokenValid = jwtUtil.validateToken(token, user);
			return ResponseEntity.ok(isTokenValid);
		} catch (ExpiredJwtException e) {
			return ResponseEntity.ok(false);
		}
	}
	
}
