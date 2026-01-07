//
//  SpeechRecognition.swift
//  eMedEvents
//
//  Created by eMed Events on 07/01/26.
//

import Foundation
import Speech
import AVFoundation
import React

@objc(SpeechRecognition)
class SpeechRecognition: RCTEventEmitter {
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private var isRecording = false // Track recording state

    override func supportedEvents() -> [String]! {
        return ["onSpeechResults", "onSpeechEnd"]
    }

    @objc func startRecording() {
        SFSpeechRecognizer.requestAuthorization { authStatus in
            DispatchQueue.main.async {
                switch authStatus {
                case .authorized:
                    AVAudioSession.sharedInstance().requestRecordPermission { granted in
                        if granted {
                            do {
                                try self.startAudioEngine()
                                self.isRecording = true
                            } catch {
                                self.sendEvent(withName: "onSpeechResults", body: ["error": "Error starting audio engine: \(error.localizedDescription)"])
                            }
                        } else {
                            self.sendEvent(withName: "onSpeechResults", body: ["error": "Microphone access not granted"])
                        }
                    }
                case .denied, .restricted, .notDetermined:
                    self.sendEvent(withName: "onSpeechResults", body: ["error": "Speech recognition authorization not granted"])
                @unknown default:
                    self.sendEvent(withName: "onSpeechResults", body: ["error": "Unknown authorization status"])
                }
            }
        }
    }

    @objc func stopRecording() {
        if isRecording {
            do {
                try self.stopAudioProcessing()
                self.isRecording = false
            } catch {
                self.sendEvent(withName: "onSpeechResults", body: ["error": "Error stopping audio processing: \(error.localizedDescription)"])
            }
        }
    }

    private func startAudioEngine() throws {
        let audioSession = AVAudioSession.sharedInstance()
        try audioSession.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .allowBluetooth, .allowBluetoothA2DP])
        try audioSession.setActive(true, options: .notifyOthersOnDeactivation)

        let inputNode = audioEngine.inputNode
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        
        guard let recognitionRequest = recognitionRequest else {
            throw NSError(domain: "SpeechRecognition", code: -1, userInfo: [NSLocalizedDescriptionKey: "Unable to create recognition request"])
        }

        recognitionRequest.shouldReportPartialResults = true
      
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            guard let self = self else { return }

            if let result = result {
                // Send partial results (optional)
                self.sendEvent(withName: "onSpeechResults", body: ["transcript": result.bestTranscription.formattedString, "isFinal": result.isFinal])

                // Check if the result is final
                if result.isFinal {
                    self.sendEvent(withName: "onSpeechEnd", body: ["transcript": result.bestTranscription.formattedString])
                    self.stopRecording()
                }
            }
            if let error = error {
                self.sendEvent(withName: "onSpeechResults", body: ["error": "Recognition error: \(error.localizedDescription)"])
            }
        }

        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            recognitionRequest.append(buffer)
        }

        audioEngine.prepare()
        try audioEngine.start()
    }

    private func stopAudioProcessing() throws {
        // End the recognition request
        recognitionRequest?.endAudio()
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)

        // Cancel the recognition task
        recognitionTask?.cancel()
        recognitionTask = nil
        recognitionRequest = nil

        // Deactivate the audio session
        let audioSession = AVAudioSession.sharedInstance()
        try audioSession.setActive(false, options: .notifyOthersOnDeactivation)
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
