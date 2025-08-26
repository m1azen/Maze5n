
import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import 'package:flutter_windowmanager/flutter_windowmanager.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    secureScreen(); // منع تصوير الشاشة
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SecureYTPlayer(videoId: 'dQw4w9WgXcQ'),
    );
  }

  Future<void> secureScreen() async {
    await FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE);
  }
}

class SecureYTPlayer extends StatefulWidget {
  final String videoId;
  SecureYTPlayer({required this.videoId});

  @override
  _SecureYTPlayerState createState() => _SecureYTPlayerState();
}

class _SecureYTPlayerState extends State<SecureYTPlayer> {
  late YoutubePlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = YoutubePlayerController(
      initialVideoId: widget.videoId,
      flags: YoutubePlayerFlags(
        autoPlay: false,
        mute: false,
        disableDragSeek: true,
        loop: false,
        hideControls: false,
        controlsVisibleAtStart: true,
        forceHD: true,
        enableCaption: false,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          YoutubePlayerBuilder(
            player: YoutubePlayer(
              controller: _controller,
              showVideoProgressIndicator: true,
              progressIndicatorColor: Colors.blueAccent,
            ),
            builder: (context, player) {
              return Center(child: player);
            },
          ),
          // Overlay شفاف لمنع التفاعل على الفيديو بشكل غير مرغوب
          Positioned.fill(
            child: IgnorePointer(
              child: Container(color: Colors.transparent),
            ),
          ),
          Positioned(
            bottom: 16,
            left: 16,
            child: Text(
              '© Mazen 2025 • للاشتراك: 0123456789',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}
