class Listener {
    constructor(PlaylistsService, MailSender) {
        this._playlistsService = PlaylistsService;
        this._mailSender = MailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());

            const playlistData = await this._playlistsService.getPlaylistSong(playlistId);

            if (!playlistData) {
                // Handle case where playlist is not found
                console.error(`Playlist with ID ${playlistId} not found.`);
                return;
            }

            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistData));

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Listener;
