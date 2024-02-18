const { Pool } = require('pg');

class PlaylistsServices {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistSong(playlistId) {
        const query = {
            text: `
                SELECT 
                    playlists.id AS playlist_id, 
                    playlists.name AS playlist_name,
                    songs.id AS song_id,
                    songs.title AS song_title,
                    songs.performer AS song_performer
                FROM 
                    playlists
                JOIN 
                    playlistsongs ON playlists.id = playlistsongs.playlist_id
                JOIN 
                    songs ON playlistsongs.song_id = songs.id
                WHERE 
                    playlists.id = $1
            `,
            values: [playlistId],
        }

        const result = await this._pool.query(query);
        if (result.rows.length === 0) {
            // Handle case where playlist is not found
            return null;
        }

        const playlistData = {
            playlist: {
                id: result.rows[0].playlist_id,
                name: result.rows[0].playlist_name,
                songs: result.rows.map((row) => ({
                    id: row.song_id,
                    title: row.song_title,
                    performer: row.song_performer,
                })),
            }
        };

        return playlistData;
    }
}

module.exports = PlaylistsServices;
